class EventBrite {
    constructor() {
        this.auth_token = 'WKLASWB55JIUWOVX6EZU';
        this.orderby = "date";
    }

    async queryAPI(eventName, category){
        const eventsResponse= await fetch ('https://www.eventbriteapi.com/v3/events/search/?q=${eventName}&sort_by$={this.orderby}&categories=${category}&token=WKLASWB55JIUWOVX6EZU');
    }

    async getCategoriesAPI(){
        const categoriesResponse = await fetch('https://www.eventbriteapi.com/v3/categories/?token=WKLASWB55JIUWOVX6EZU')
    
    
        const categories = await categoriesResponse.json();

        return {
            categories
        }
    
    
    }





}

