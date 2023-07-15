export default function initResizer(
  resizerTool: any,
  toolSpace: any,
  workSpace: any
) {
  const bodyWidth: number = document.body.clientWidth;

  var x: number, w: number;

  function rs_mouseDownHandler(e: MouseEvent) {
    x = e.clientX;
    var sbWidth: string = window.getComputedStyle(toolSpace, "").width;
    w = parseInt(sbWidth, 10);

    resizerTool.style.backgroundColor = "#4c9aff"

    document.addEventListener("mousemove", rs_mouseMoveHandler);
    document.addEventListener("mouseup", rs_mouseUpHandler);
  }

  function rs_mouseMoveHandler(e: MouseEvent) {
    document.body.style.cursor = "col-resize";

    var dx: number = e.clientX - x;
    var cw: number = w + dx;


    if (cw < bodyWidth / 2) {
      toolSpace.style.width = `${cw}px`;
      workSpace.style.width = `${bodyWidth - cw}px`;
    }

    if (cw > bodyWidth / 2) {
      toolSpace.style.width = `${bodyWidth / 2}px`;
      workSpace.style.width = `${bodyWidth / 2}px`;
    }

    if (cw < 350) {
      toolSpace.style.width = `350px`;
      workSpace.style.width = `${bodyWidth - 350}px`;
    }
  }

  function rs_mouseUpHandler() {
    document.body.style.cursor = "default";

    resizerTool.style.backgroundColor = "#D3D3D3"

    document.removeEventListener("mouseup", rs_mouseUpHandler);
    document.removeEventListener("mousemove", rs_mouseMoveHandler);
  }

  resizerTool.addEventListener("mousedown", rs_mouseDownHandler);
}
