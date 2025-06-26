import { chosenCategorie, productsList } from "./selection.js";
const modal = document.getElementById("choices");
let contentChoice = "";
let mainContent = "";
import { addToResult, orderContent, orderContentMenu, substractFromResult, updateOrder } from "./order.js";
import { Menu } from "./classes.js";


const contentModal = {
    menus: {
        1: {
            title: "Une grosse faim?",
            sentence: "Le menu maxi Best Of comprend un sandwich, une grande frite et une boisson 50 Cl (+ 2 €)",
            images: {
                image1: "../img/images/illustration-maxi-best-of.png",
                image2: "../img/images/illustration-best-of.png"
            },
            label: {
                id1: "maxi",
                id2: "best",
                name: "size"
            },
            imageTitle: {
                title1: "Menu Maxi Best Of",
                title2: "Menu Best Of"
            },
            button: "Étape suivante"
        },
        2: {
            title: "Choisissez votre accompagnement",
            sentence: "Le choix de Sophie ultime! Le plaisir ou le corps de rêve!",
            images: {
                image1: "../img/frites/MOYENNE_FRITE.png",
                image2: "../img/salades/PETITE-SALADE.png"
            },
            label: {
                id1: "Frites",
                id2: "Salade",
                name: "chips-salad"
            },
            imageTitle: {
                title1: "Frites",
                title2: "Salade"
            },
            button: "Étape suivante"
        },
        3: {
            title: "Choisissez votre style de patates",
            sentence: "Frites, potatoes, la pomme de terre dans tous ses états",
            images: {
                image1: "../img/frites/MOYENNE_FRITE.png",
                image2: "../img/frites/GRANDE_POTATOES.png"
            },
            label: {
                id1: "Frites",
                id2: "Potatoes",
                name: "chips-potatoes"
            },
            imageTitle: {
                title1: "Frites",
                title2: "Potatoes"
            },
            button: "Étape suivante"
        },
        4: {
            title: "Choisissez votre boisson",
            sentence: "Un soda , un jus de fruit ou un verre d’eau pour accompagner votre repas",
            button: "Ajouter le menu à ma commande"
        }
    },
    boissons: {
        title: "Une petite soif?",
        sentence: "Choisissez la taille de votre boisson, +0.50€ pour le format 50 Cl",
        label: {
            id1: "30",
            id2: "50",
            name: "size"
        },
        imageTitle: {
            title1: "30Cl",
            title2: "50Cl"
        },
        button: {
            button1: "Annuler",
            button2: "Ajouter à ma commande"
        }
    }
};

modal.addEventListener("click", (e) => {
    // Astuce de chatGPT pour éviter que le clic ne remonte jusqu'à son parent qui, lui, ferme la modale quand on clique dessus.
    e.stopPropagation();
})
let step = 0;

export const backgroundClick = () => {
    step = 0;
    updateOrder();
}

const menu = {
    name: "",
    price: 0,
    supplements: []
};
export const openMenusWindow = (name, price) => {
    step++;
    menu.name = name;
    menu.price = price;

    if (step === 1 || step === 2 || step === 3) {
        mainContent = `
        <label class="firstLabels" for="${contentModal[chosenCategorie][step]["label"].id1}">
        <input type="radio" id="${contentModal[chosenCategorie][step]["label"].id1}" value="${contentModal[chosenCategorie][step]["label"].id1}" name="${contentModal[chosenCategorie][step]["label"].name}">
        <figure><img src="${contentModal[chosenCategorie][step]["images"].image1}" alt=""></figure>
        <span>${contentModal[chosenCategorie][step]["imageTitle"].title1}</span>
        </label>
        <label class="firstLabels" for="${contentModal[chosenCategorie][step]["label"].id2}">
        <input type="radio" id="${contentModal[chosenCategorie][step]["label"].id2}" value="${contentModal[chosenCategorie][step]["label"].id2}" name="${contentModal[chosenCategorie][step]["label"].name}">
        <figure><img src="${contentModal[chosenCategorie][step]["images"].image2}" alt=""></figure>
        <span>${contentModal[chosenCategorie][step]["imageTitle"].title2}</span>
        </label>
        `
    } else if (step === 4) {
        let content = "";
        productsList.boissons.forEach(product => {
            content += `
            
            <label class="lastLabels" for="${product.nom}">
            <input type="radio" id="${product.nom}" value="${product.nom}" name="boissons">
            <figure><img src="../img${product.image}" alt=""></figure>
            <span>${product.nom}</span>
            </label>
            `})
        mainContent = new Menu(content, 2).render()
    }

    contentChoice = `
        <span id="closeButton" class="close">&times;</span>
        <button id="back" type="button">Retour</button>
        <form action="">
        <header>
        <h1>${contentModal[chosenCategorie][step].title}</h1>
        <p>${contentModal[chosenCategorie][step].sentence}</p>
        </header>
        <div>
        ${mainContent}
        </div>
        <button disabled type="submit">${contentModal[chosenCategorie][step].button}</button>
        </form>
        `

    modal.innerHTML = contentChoice;

    modal.querySelector("#closeButton").addEventListener("click", () => {
        backgroundModal.style.display = "none";
        step = 0;
        updateOrder();
    })

    const back = modal.querySelector("#back");
    if (step >= 2) {
        back.style.display = "block"
    } else {
        back.style.display = "none"
    }

    back.addEventListener("click", () => {
        const cancelledSupplement = menu.supplements.pop()
        if (step === 2) {
            // Alors là c'est le bordel! Mais c'est tout ce que j'ai trouvé.
            if (menu.name.toLowerCase().includes("maxi")) {
                menu.name = menu.name.replace("Menu Maxi Best Of", "Menu");
                menu.price = ((menu.price * 100) - 200) / 100;
            }
        } if (step === 4) {
            if (cancelledSupplement === "Salade") {
                step -= 1
            }
        }
        step -= 2;
        updateOrder()
        openMenusWindow(menu.name, menu.price)
    })


    const labels = modal.querySelectorAll("label");
    labels.forEach(label => {
        label.addEventListener("click", () => {
            labels.forEach(item => {
                item.classList.remove("selected")
            })
            label.classList.add("selected");
            modal.querySelector("button[type='submit']").removeAttribute("disabled")
        })
    });

    const form = document.querySelector("form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const choice = form.querySelector("input[type='radio']:checked").value;
        // const lastOrderIndex = orderContentMenu.length - 1;
        if (step === 1) {
            menu.supplements = [];
            if (choice === "maxi") {
                menu.name = menu.name.replace("Menu", "Menu Maxi Best Of");
                // Seul moyen que j'ai trouvé pour que les 2€ s'ajoutent correctement. orderContentMenu[lastOrderIndex].price += 2 donnait 10.92 pour un prix initial de 10.9.
                menu.price = ((menu.price * 100) + 200) / 100;
            }
            openMenusWindow(menu.name, menu.price);
        } else if (step === 2) {
            if (choice === "Salade") {
                menu.supplements.push(choice)
                step = 3;// Pour sauter l'étape du choix frites/potatoes
            }
            openMenusWindow(menu.name, menu.price);
        } else if (step === 3) {
            menu.supplements.push(choice);
            openMenusWindow(menu.name, menu.price)
        } else if (step === 4) {
            menu.supplements.push(choice);
            orderContentMenu.push({...menu, menu});
            backgroundModal.style.display = "none";
            step = 0
            addToResult(Number(menu.price));
        }
        updateOrder()

    })
    const leftArrow = document.getElementById("leftArrow2");
    const rightArrow = document.getElementById("rightArrow2");
    const categories = document.getElementById("categoriesList2");

    rightArrow?.addEventListener("click", () => {
        categories.scrollBy({ left: 200, behavior: 'smooth' })
    })

    leftArrow?.addEventListener("click", () => {
        categories.scrollBy({ left: -200, behavior: 'smooth' })
    })
}

export const openDrinksWindow = (name, price, image) => {
    let number = 1;
    mainContent = `
                <label class="firstLabels" id="little-drink" for="${contentModal[chosenCategorie]["label"].id1}">
                    <input type="radio" id="${contentModal[chosenCategorie]["label"].id1}" value="${contentModal[chosenCategorie]["label"].id1}" name="${contentModal[chosenCategorie]["label"].name}">
                    <figure><img src="../img${image}" alt=""></figure>
                    <span>${contentModal[chosenCategorie]["imageTitle"].title1}</span>
                </label>
                <label class="firstLabels" for="${contentModal[chosenCategorie]["label"].id2}">
                    <input type="radio" id="${contentModal[chosenCategorie]["label"].id2}" value="${contentModal[chosenCategorie]["label"].id2}" name="${contentModal[chosenCategorie]["label"].name}">
                    <figure><img src="../img${image}" alt=""></figure>
                    <span>${contentModal[chosenCategorie]["imageTitle"].title2}</span>
                </label>
                `

    contentChoice = `
        <span id="closeButton" class="close">&times;</span>
        <button id="back" type="button">Retour</button>
        <form action="">
            <header>
                <h1>${contentModal[chosenCategorie].title}</h1>
                <p>${contentModal[chosenCategorie].sentence}</p>
            </header>
            <div>
            ${mainContent}
            </div>
            <div id="counter">
                <button type="button" id="less">-</button>
                <div id="count">${number}</div>
                <button type="button" id="more">+</button>
            </div>
            <div id="drinkButtons">
                <button type="button">${contentModal[chosenCategorie]["button"].button1}</button>
                <button disabled type="submit">${contentModal[chosenCategorie]["button"].button2}</button>
            </div>
            
        </form>
        
        `
    modal.innerHTML = contentChoice;

    modal.querySelector("#closeButton").addEventListener("click", () => {
        backgroundModal.style.display = "none";
    })

    const less = modal.querySelector("#less");
    const count = modal.querySelector("#count");

    const updateCount = () => {
        count.textContent = number;
        less.disabled = number <= 1 // Astuce de chatGPT pour éviter les if puis removeAttribute, etc...
    }

    less.addEventListener("click", () => {
        number -= 1;
        updateCount()
    })

    modal.querySelector("#more").addEventListener("click", () => {
        number += 1;
        updateCount()
    })

    updateCount()

    const labels = modal.querySelectorAll("label");
    labels.forEach(label => {
        label.addEventListener("click", () => {
            labels.forEach(item => {
                item.classList.remove("selected")
            })
            label.classList.add("selected");
            modal.querySelector("button[type='submit']").removeAttribute("disabled")
        })
    });

    const form = document.querySelector("form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const choice = form.querySelector("input[type='radio']:checked").value;
        if (choice === "50") {
            const index = orderContent.indexOf(orderContent.find(item => item.name === name + " 50Cl"));
            if (index != -1) {
                orderContent[index].quantity += number;
                orderContent[index].price = (Math.round(Number(orderContent[index].price) * 100) + Math.round(Number(price) * 100 + 50) * number) / 100
            } else {
                orderContent.push({
                    name: name + " 50Cl",
                    price: ((Math.round(price * 100) + 50) * number / 100),
                    quantity: number
                })
            }
            // addToResult(Number((((price * 100) + 50) / 100) * number))
            addToResult(Number(price) + 0.5, number)
        } else if (choice === "30") {
            const index = orderContent.indexOf(orderContent.find(item => item.name === name + " 30Cl"));
            if (index != -1) {
                orderContent[index].quantity += number;
                orderContent[index].price = (Math.round(Number(orderContent[index].price) * 100) + Math.round(Number(price) * 100) * number) / 100
            } else {
                orderContent.push({
                    name: name + " 30Cl",
                    price: ((Math.round(price * 100)) * number / 100),
                    quantity: number
                })
            }
            // addToResult(Math.floor(Number((price * 100) * number) / 100))
            addToResult(price, number)
        }
        backgroundModal.style.display = "none";
        updateOrder()
    })

}
