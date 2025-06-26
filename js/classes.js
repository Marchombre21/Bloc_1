

export class Menu {
    constructor(list, number) {
        this.list = list;
        //C'est ce que j'ai trouvé de mieux pour pallier au problème quand deux menus apparaissent sur la même page.
        this.number = number
    }
    render() {
        return (
            `
            <button type="button" id="leftArrow${this.number}" class="arrow ">
                <figure>
                    <img 
                    src="../img/images/fleche-slider.png" 
                    alt="leftArrow" />
                </figure>
            </button>

            <div id="categoriesList${this.number}">
            ${this.list}
            </div>

            <button type="button" id="rightArrow${this.number}" class="arrow ">
                <figure>
                    <img

                    src="../img/images/fleche-slider.png"
                    alt="rightArrow"/>
                </figure>
            </button>
        `
        )

    }
}

