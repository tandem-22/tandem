import Document, { Html, Head, Main, NextScript } from "next/document";
import dotenv from "dotenv-safe";

// Check that all environment variables in ".env.example" are defined
dotenv.config();

class CustomDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
