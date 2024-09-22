export const POST = async (req: Request) => {
  const imageBlob = await req.blob();
  const data = new FormData();
  data.set("reqtype", "fileupload");
  data.set("fileToUpload", imageBlob, "sigma.png");
  console.log(data);

  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: data,
  });

  const json = await response.text();
  return new Response(json);
};
