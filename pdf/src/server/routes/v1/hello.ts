import { defineEventHandler } from "h3";
import shell from "shelljs";

export default defineEventHandler(() => {
  shell.echo("hello world");
  shell.ls(".");
  console.log(shell.exec("ls"));

  return { message: "Hello World" };
});

// gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
// -dNOPAUSE -dQUIET -dBATCH -sOutputFile=output.pdf input.pdf
