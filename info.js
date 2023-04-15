const delSaveBtn = document.getElementById("save-del-btn")


delSaveBtn.addEventListener("click", deleteSave);

function deleteSave(){
   if(window.confirm("Do you want to delete saved statistics and other saved data?")){
    localStorage.removeItem("lotteryData");
    window.location.reload();
   }
}