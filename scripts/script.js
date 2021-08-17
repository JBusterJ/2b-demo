const $ = document.querySelectorAll.bind(document);
$(".focusable, .button").forEach((el) => {
    // blur only on mouse click
    // for accessibility, keep focus when keyboard focused
    el.addEventListener("mousedown", (e) => e.preventDefault());
    el.setAttribute("tabindex", "0");
});
$(".server").forEach((el) => {
    el.addEventListener("click", () => {
        const activeServer = $(".server.active")[0];
        activeServer.classList.remove("active");
        activeServer.removeAttribute("aria-selected");
        el.classList.add("active");
        el.setAttribute("aria-selected", true);
    });
});
$(".channel-text").forEach((el) => {
    el.addEventListener("click", () => {
        $(".channel-text.active")[0].classList.remove("active");
        el.classList.add("active");
    });
});
// focus/blur on channel header click
$(".channels-header")[0].addEventListener("click", (e) => {
    e.preventDefault();
    const focused = document.activeElement === e.target;
    focused ? e.target.blur() : e.target.focus();
});
var index = 0;;

function changeActive() {
    $(".channel-text").forEach((el) => {
        $(".channel-text.active")[0].classList.remove("active");
        $(".channel-text")[index].classList.add("active");
    });
}

function swapContent(z) {
    index = z;
    var contentArray = [];
    for (var i = 0; i < 6; i++) {
        contentArray.push(document.getElementById("info" + i));
        contentArray[i].style.display = "none";
    }
    contentArray[index].style.display = "block";
}