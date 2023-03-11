
export default function initResizer(resizerTool: any, toolSpace: any) {

    const bodyWidth : number = document.body.clientWidth;

    var x: number, w: number;

    function rs_mouseDownHandler(e: MouseEvent) {

        x = e.clientX;
        var sbWidth: string = window.getComputedStyle(toolSpace, "").width;
        w = parseInt(sbWidth, 10);

        document.addEventListener("mousemove", rs_mouseMoveHandler);
        document.addEventListener("mouseup", rs_mouseUpHandler);
        
    }

    function rs_mouseMoveHandler(e: MouseEvent) {

        var dx: number = e.clientX - x;
        var cw: number = w + dx;

        if (cw < bodyWidth / 2) {
            toolSpace.style.width = `${cw}px`;
        }

        if (cw < 350) {
            toolSpace.style.width = `350px`;
        }
    }

    function rs_mouseUpHandler() {
        document.removeEventListener("mouseup", rs_mouseUpHandler);
        document.removeEventListener("mousemove", rs_mouseMoveHandler);
    }

    resizerTool.addEventListener("mousedown", rs_mouseDownHandler);

}