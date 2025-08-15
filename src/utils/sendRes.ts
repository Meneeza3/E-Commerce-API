import { Response } from "express";

class sendResponse {
  static success(res: Response, message: string, data?: any) {
    return res.status(200).json({
      status: "success",
      message,
      data,
    });
  }

  static badRequest(res: Response, message: string, error?: any) {
    return res.status(400).json({
      status: "fail",
      message,
      error,
    });
  }

  static unauthorized(res: Response, message: string, error?: any) {
    return res.status(401).json({
      status: "fail",
      message,
      error,
    });
  }

  static notFound(res: Response, message: string, error?: any) {
    return res.status(404).json({
      status: "fail",
      message,
      error,
    });
  }

  static internalError(res: Response, message: string, error?: any) {
    return res.status(500).json({
      status: "fail",
      message,
      error,
    });
  }
}

export default sendResponse;
