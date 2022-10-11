declare module "aws-cloudfront-sign" {
  export * from "aws-cloudfront-sign";
  export function getSignedUrl(objectKey: string, options: any): string;
}
