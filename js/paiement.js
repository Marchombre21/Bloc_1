const inputs = document.querySelectorAll("input[type='text']");
const send = document.querySelector("button[type='button']");

inputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/, "")
        if(e.target.value != "" && index < inputs.length -1){
            inputs[index + 1].disabled = false;
            inputs[index + 1].focus(); // Astuce de chatGPT pour passer directement à l'input suivant quand le précédent est rempli
        }
        send.disabled = inputs[0].value === "" || inputs[1].value === "" || inputs[2].value === "" ;
    });

});

const sendOrder = async (order) => {
try{
   const response = await fetch("http://localhost/fake-api", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: order
    })
    if(!response.ok){
        throw new Error("Un soucis à eu lieu avec l'envoi de la commande.")
    }
    console.log("Commande bien envoyée!");
} catch (error){
    alert("Un problème a eu lieu lors de l'envoi de la commande.")
    console.error(error);
}
}
send.addEventListener("click", () => {
    let tableTent = ""
    inputs.forEach(input => {
        tableTent += input.value
    })
    const order = JSON.parse(localStorage.getItem("order"));
    order.orderNumber += ` assignée à ${tableTent}` ;
    sendOrder(JSON.stringify(order));
    document.querySelector("figure").style.display = "none";
    document.querySelector("h1").innerText = "Toute l'équipe vous remercie!";
    document.querySelector("h4").innerText = "Et vous souhaite un bon appétit dans nos restaurants ,";
    document.querySelector("#inputs").innerHTML = "<p id='message'>À bientôt!</p>";
    document.querySelector("#inputs").style.justifyContent = "left";
    document.querySelector("#lastButton").style.display = "block";
    document.querySelector("main").style.margin = "40dvh auto 0";
    send.style.display = "none";
})