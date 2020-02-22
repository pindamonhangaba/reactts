export type ContentType = "aplication/json" | "text/plain";

// Use like: downloadFile(jsonData, "json.txt", "text/plain");
export function downloadFile(
  content: string,
  fileName: string,
  contentType: ContentType
) {
  var a = document.createElement("a");
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
