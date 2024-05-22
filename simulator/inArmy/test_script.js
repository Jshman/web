document.getElementById("showPopup").addEventListener("click", function() {
    document.getElementById("popup").style.display = "block";
    document.querySelector(".popup-background").style.display = "block";
});

document.getElementById("closePopup").addEventListener("click", function() {
    document.getElementById("popup").style.display = "none";
    document.querySelector(".popup-background").style.display = "none";
});

