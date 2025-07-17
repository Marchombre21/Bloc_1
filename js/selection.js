import { Menu } from './classes.js'
const categoriesNav = document.getElementById("categories");
const categoriesContent = document.getElementById("content");
const headerProducts = document.querySelector("header");
const backgroundModal = document.getElementById("backgroundModal");
import './order.js';
import { orderContent, updateOrder, addToResult } from './order.js';
import { backgroundClick, openDrinksWindow, openMenusWindow } from './modal.js';


const presentationCategorie = {
    menus: "Un sandwich, une friture ou une salade et une boisson.",
    boissons: "Une petite soif, sucrée, légère et rafraîchissante!",
    burgers: "Un délicieux problème de cholestérol enrobé de sauces très sucrées pour que les enfants en mangent.",
    frites: "Croustillantes si elles n'avaient pas été tellement baignées dans l'huile qu'elles en gouttent encore.",
    encas: "Pour ceux qui ont faim mais pas trop.",
    wraps: "Laissez-vous wrapper!",
    salades: "Aller au Wacdo pour une salade c'est comme aller dans une maison close pour un calin.",
    desserts: "Encore un peu de sucre?",
    sauces: "Au cas où il n'y en ait pas assez."
};

const getCategories = async () => {
    try {
        const response = await fetch("../datas/categories.json");
        if (!response.ok) {
            throw new Error("Les catégories n'ont pas pu être récupérées.")
        }
        const categories = await response.json();
        return categories

    } catch (error) {
        console.error(error)
    }
}

const getProducts = async () => {
    try {
        const response = await fetch("../datas/produits.json");
        if (!response.ok) {
            throw new Error("Les produits n'ont pas pu être récupérés.")
        }
        const productsList = await response.json();
        return productsList
    } catch (error) {
        console.error(error)
    }
}

const categoriesList = await getCategories();
export const productsList = await getProducts();

let categoriesArray = categoriesList.map(item => {
    const isSelected = item.title === "menus" ? "selected" : ""
    return (
        `
        <button class="categoriesButton ${isSelected}" data-title = ${item.title} >
            <figure>
                <img src="../img${item.image}" alt="${item.image}-logo" />
                <figcaption><div>${item.title}</div></figcaption>
            </figure>
        </button>
        `
    )
})

categoriesNav.innerHTML = new Menu(categoriesArray.join(""), 1).render();

// Le premier contenu à être affiché est celui des menus.
let currentCategorieContent = productsList.menus;
export let chosenCategorie = "menus";

backgroundModal.addEventListener("click", () => {
    backgroundModal.style.display = "none";
    if (chosenCategorie === "menus") {
        backgroundClick();
    }

})

const setCurrentCategorieContent = () => {
    headerProducts.innerHTML = `
    <h1>Nos ${chosenCategorie}</h1> 
    <p>${presentationCategorie[chosenCategorie]}</p>
    `
    let content = "";
    currentCategorieContent.forEach(product => {
        content += `
        <button class="productButton" data-image="${product.image}" data-name="${product.nom}" data-price="${product.prix}">
          <figure>
            <img src="../img${product.image}" alt="${product.nom}-logo">
            <figcaption>
                <strong>${product.nom}</strong>
                <p>${product.prix} €</p>
            </figcaption>
          </figure>
        </button>
    `
    })
    categoriesContent.insertAdjacentHTML('beforeend', content)

    // On définit les constantes après que le chargement a été fait.
    const categorieButtons = document.querySelectorAll(".categoriesButton");
    const productButtons = document.querySelectorAll(".productButton");
    const leftArrow = document.getElementById("leftArrow1");
    const rightArrow = document.getElementById("rightArrow1");
    const categories = document.getElementById("categoriesList1");


    // Ici on utilise la fonction native de js .scrollBy pour faire défiler un élément, et même plus précisemment, le scrollLeft qui gère le défilement horizontal (en opposition au scrollTop).


    rightArrow.addEventListener("click", () => {
        categories.scrollBy({ left: 200, behavior: 'smooth' })
    })

    leftArrow.addEventListener("click", () => {
        categories.scrollBy({ left: -200, behavior: 'smooth' })
    })

    categorieButtons.forEach(button => {
        button.addEventListener("click", () => {
            categorieButtons.forEach(item => {
                item.classList.remove("selected")
            })
            button.classList.add("selected")
            chosenCategorie = button.dataset.title;
            currentCategorieContent = productsList[chosenCategorie];
            categoriesContent.innerHTML = "";
            setCurrentCategorieContent();
        })
    });
    productButtons.forEach(button => {
        button.addEventListener("click", () => {
            const name = button.dataset.name;
            const price = button.dataset.price;
            const image = button.dataset.image;

            if (chosenCategorie === "menus") {
                openMenusWindow(name, price)
                backgroundModal.style.display = "flex"

            } else if (chosenCategorie === "boissons") {
                openDrinksWindow(name, price, image);
                backgroundModal.style.display = "flex"

            } else {
                const index = orderContent.indexOf(orderContent.find(item => item.name === name));
                if (index != -1) {
                    orderContent[index].quantity += 1;
                    orderContent[index].price = Math.round(Number(orderContent[index].price) * 100 + Number(price) * 100) / 100
                } else {
                    orderContent.push({
                        name,
                        price,
                        quantity: 1
                    })
                }

                addToResult(price)
            }
            updateOrder()

        })
    });
}
setCurrentCategorieContent();
