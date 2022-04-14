class UI {
    constructor(){
        this.init();
    }
    init() {
        this.printCategories();  
    }
    printCategories() {
            const categoriesList = eventbrite.getCategoriesAPI()
            .then(categories => {
                const categoriesList = categories.categories.categories;
                const categoriesSelect = document.querySelector('select#category');

                    //inserts catergories

                categoriesList.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.appendChild(document.createTextNode(category.name));
                    categoriesSelect.appendChild(option);
                })
            
           
            })
            .catch(error => console.log(error));
        }

        
}

