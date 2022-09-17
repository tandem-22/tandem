# first, import all necessary modules
import blobconverter
import depthai
import numpy as np
from flask import Response
from flask import Flask
from flask_sock import Sock
import cv2
import time
import json
from playsound import playsound

# Pipeline tells DepthAI what operations to perform when running - you define all of the resources used and flows here
pipeline = depthai.Pipeline()

# Two mono cameras
# mono_right = pipeline.createMonoCamera()
# mono_left = pipeline.createMonoCamera()
# stereo = pipeline.createStereoDepth()
# spacial_location_calc = pipeline.createSpatialLocationCalculator()
#
# mono_left.setResolution(depthai.MonoCameraProperties.SensorResolution.THE_400_P)
# mono_left.setBoardSocket(depthai.CameraBoardSocket.LEFT)
# mono_right.setResolution(depthai.MonoCameraProperties.SensorResolution.THE_400_P)
# mono_right.setBoardSocket(depthai.CameraBoardSocket.RIGHT)
#
# stereo.setDefaultProfilePreset(depthai.node.StereoDepth.PresetMode.HIGH_DENSITY)
# stereo.setDepthAlign(depthai.CameraBoardSocket.RGB)
# stereo.setOutputSize(mono_left.getResolutionWidth(), mono_left.getResolutionHeight())
# mono_left.out.link(stereo.left)
# mono_right.out.link(stereo.right)
#
# topLeft = depthai.Point2f(0.4, 0.4)
# bottomRight = depthai.Point2f(0.6, 0.6)
#
# stereo.depth.link(spacial_location_calc.inputDepth)
#
# config.depthThresholds.lowerThreshold = 100
# config.depthThresholds.upperThreshold = 10000
# config.roi = depthai.Rect(topLeft, bottomRight)
# spacial_location_calc.initialConfig.addROI(config)

# First, we want the Color camera as the output
cam_rgb = pipeline.createColorCamera()
cam_rgb.setPreviewSize(672, 384)
cam_rgb.setInterleaved(False)

# Next, we want a neural network that will produce the detections
detection_nn = pipeline.createMobileNetDetectionNetwork()
# Blob is the Neural Network file, compiled for MyriadX. It contains both the definition and weights of the model
# We're using a blobconverter tool to retreive the MobileNetSSD blob automatically from OpenVINO Model Zoo
detection_nn.setBlobPath(blobconverter.from_zoo(name='vehicle-detection-adas-0002', shaves=6))
# Next, we filter out the detections that are below a confidence threshold. Confidence can be anywhere between <0..1>
detection_nn.setConfidenceThreshold(0.7)
# Next, we link the camera 'preview' output to the neural network detection input, so that it can produce detections
cam_rgb.preview.link(detection_nn.input)

resize = pipeline.createImageManip()
resize.initialConfig.setResize(437, 250)
resize.initialConfig.setHorizontalFlip(True)
cam_rgb.preview.link(resize.inputImage)

# XLinkOut is a "way out" from the device. Any data you want to transfer to host need to be send via XLink
xout_rgb = pipeline.createXLinkOut()
# For the rgb camera output, we want the XLink stream to be named "rgb"
xout_rgb.setStreamName("rgb")
# Linking camera preview to XLink input, so that the frames will be sent to host
resize.out.link(xout_rgb.input)

# The same XLinkOut mechanism will be used to receive nn results
xout_nn = pipeline.createXLinkOut()
xout_nn.setStreamName("nn")
detection_nn.out.link(xout_nn.input)

# xout_sp = pipeline.createXLinkOut()
# xout_sp.setStreamName("sp")
# spacial_location_calc.out.link(xout_sp.input)


# The risk level determined by the model
risk_level = 0
danger_left = False
danger_right = True


def generate():
    global risk_level, danger_left, danger_right
    # Pipeline is now finished, and we need to find an available device to run our pipeline
    # we are using context manager here that will dispose the device after we stop using it
    with depthai.Device(pipeline, usb2Mode=True) as device:
        # From this point, the Device will be in "running" mode and will start sending data via XLink

        # To consume the device results, we get two output queues from the device, with stream names we assigned earlier
        q_rgb = device.getOutputQueue("rgb")
        q_nn = device.getOutputQueue("nn")
        # q_sp = device.getOutputQueue("sp")

        # Here, some of the default values are defined. Frame will be an image from "rgb" stream, detections will contain nn results
        frame = None
        detections = []

        # Since the detections returned by nn have values from <0..1> range, they need to be multiplied by frame width/height to
        # receive the actual position of the bounding box on the image
        def frameNorm(frame, bbox):
            normVals = np.full(len(bbox), frame.shape[0])
            normVals[::2] = frame.shape[1]
            return (np.clip(np.array(bbox), 0, 1) * normVals).astype(int)

        # Main host-side application loop
        while True:
            # we try to fetch the data from nn/rgb queues. tryGet will return either the data packet or None if there isn't any
            in_rgb = q_rgb.tryGet()
            in_nn = q_nn.tryGet()
            # in_sp = q_sp.tryGet()

            if in_rgb is not None:
                # If the packet from RGB camera is present, we're retrieving the frame in OpenCV format using getCvFrame
                frame = in_rgb.getCvFrame()
                # frame = imutils.resize(frame, width=336)

            if in_nn is not None:
                # when data from nn is received, we take the detections array that contains mobilenet-ssd results
                detections = in_nn.detections

            # if in_sp is not None:
            #     distances = in_sp.getSpatialLocations()
            #     print(f"Length of distances: {len(distances)}")
            #     print(f"Closest distance: {distances[0].depthMin} mm")
            danger_score = 0
            if frame is not None:
                for detection in detections:
                    # calculate size of bounding box from 0 to 1
                    area = (detection.xmax - detection.xmin) * (detection.ymax - detection.ymin)

                    # check if bbox is on left side, right side, or middle
                    side = 1  # middle
                    if detection.xmax < 0.5:
                        # print(f"car left {area}")
                        side = 0  # left
                        if area > 0.05:
                            danger_left = True
                    elif detection.xmin > 0.5:
                        # print(f"car right {area}")
                        side = 2  # right
                        if area > 0.05:
                            danger_right = True

                    danger_score += area * (1.5 if side != 1 else 1)

                    # for each bounding box, we first normalize it to match the frame size
                    bbox = frameNorm(frame, (1 - detection.xmin, detection.ymin, 1 - detection.xmax, detection.ymax))
                    # and then draw a rectangle on the frame to show the actual result
                    cv2.rectangle(frame, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (255, 0, 0), 2)

                (flag, encodedImage) = cv2.imencode(".jpg", frame)

                if not flag:
                    continue

                yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' +
                       bytearray(encodedImage) + b'\r\n')

            # print(f"Danger score: {danger_score}")
            if danger_score > 0.08:
                risk_level = 2
            elif danger_score > 0.02:
                risk_level = 1
            else:
                risk_level = 0


# initialize a flask object
app = Flask(__name__)
sock = Sock(app)


@sock.route("/ws")
def websocket(ws):
    global risk_level, danger_left, danger_right
    last_risk_level = -1
    # while risk_level != last_risk_level or danger_left or danger_right:
    while True:
        last_risk_level = risk_level
        if danger_right or danger_left:
            risk_level = 2
        ws.send(json.dumps({"risk_level": risk_level, "danger_left": danger_left, "danger_right": danger_right}))

        # Play sounds
        if risk_level != last_risk_level:
            if risk_level == 2:
                playsound("../frontend/public/red.mp3")
                playsound("../frontend/public/red.mp3")
            if danger_right and not danger_left:
                playsound("../frontend/public/keep-left.mp3")
            elif danger_left and not danger_right:
                playsound("../frontend/public/keep-right.mp3")

        danger_left = False
        danger_right = False
        time.sleep(1)


@app.route("/video_feed")
def video_feed():
    # return the response generated along with the specific media
    # type (mime type)
    return Response(generate(),
                    mimetype="multipart/x-mixed-replace; boundary=frame")


app.run(host="localhost", port=3001, debug=False,
        threaded=True, use_reloader=False)
