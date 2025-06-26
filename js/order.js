const orderNumber = JSON.parse(localStorage.getItem("number")) + 1;
localStorage.setItem("number", JSON.stringify(orderNumber));
export const orderContent = [];
export const orderContentMenu = [];
const typeOrder = new URLSearchParams(window.location.search);
const order = document.getElementById("order");
let result = 0;

export const addToResult = (price, number = 1) => {
  //Seul moyen de réussir à avoir les bons résultats. Le math.floor ne suffisait pas pour les multiples de 3. J'avais plein de chiffres après la virgule.
  const convertCents = Math.round(Number(price) * 100);
  const total = convertCents * number;
  result = Math.round((result * 100) + total) / 100
};

export const substractFromResult = (price) => {
  const convertCents = Math.round(Number(price) * 100);
  result = Math.max(Math.round((result * 100) - convertCents) / 100, 0);
}

export const updateOrder = () => {
  const listMenus = orderContentMenu.map((item, index) => {
    const supplementsList = item.supplements.map(supplement => {
      return (
        `
        <li>${supplement}</li>
        `
      )
    })
    // Ici je sépare le prix et la poubelle du h4 car, sur petit écran, ça se mettait entre le nom et les suppléments.
    // Le data index pour savoir quel élément supprimer et le data type pour savoir si je dois supprimer dans les menus ou l'autre tableau.
    return (
      `<div class="borderOrder">
        <h4>${item.name}</h4>
        <ul>${supplementsList.join("")}</ul>
        <div class="price-trash">${item.price} €<figure><img class="trashs" data-type="menus" data-index =${index} src="../img/images/trash.png" alt="trash"></figure></div>
      </div>
      
      `
    )
  })

  const list = orderContent.map((item, index) => {
    return (
      `
      <h4 class="borderOrder"><p>${item.quantity}x ${item.name}</p><span class="price-trash">${item.price}€<figure><img class="trashs" data-type="noMenus" data-index =${index} src="../img/images/trash.png" alt="trash"></figure></span></h4>
      `
    )
  })

  order.innerHTML = `
      <header>
        <figure id="logo">
          <img src="../img/images/logo.png" alt="logo" />
        </figure>
        <p>Commande n° <span class="fatAndBold">${orderNumber}</span></p>
        <p>${typeOrder.get("type") === "eatIn" ? "Sur place" : "À emporter"}</p>
      </header>
      <div id="listContent">
        <div>${listMenus.join("")} ${list.join("")}</div>
        <footer>
          <p>TOTAL (ttc) <span class="fatAndBold">${Math.round(result * 100) / 100} €</span></p>
          <div id="buttons">
            <button><a href="../index.html">Abandon</a></button>
            <button id="pay">Payer</button>
          </div>
        </footer>
      </div>
      
    `
  order.querySelectorAll(".trashs").forEach(trash => {
    trash.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      const type = e.target.dataset.type;
      if (type === "menus") {
        const deletedItem = orderContentMenu.splice(index, 1)
        substractFromResult(Number(deletedItem[0].price))
      } else if (type === "noMenus") {
        const deletedItem = orderContent.splice(index, 1);
        substractFromResult(Number(deletedItem[0].price))
      }
      updateOrder()
    })
  })
  const finalOrder = {
    orderNumber,
    orderChoices: [
      orderContent,
      orderContentMenu
    ]
  };

  order.querySelector("#pay").addEventListener("click", () => {
    localStorage.setItem("order", JSON.stringify(finalOrder))
    window.location.href = "./paiement.html"
  })
}


updateOrder();
