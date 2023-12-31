class APIFeatures {
    constructor(query, queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }
    //search by make model and body
    search(){
        const keyword=this.queryStr.keyword ?{
            $or: [
                { make: { $regex: this.queryStr.keyword, $options: "i" } },
                { model: { $regex: this.queryStr.keyword, $options: "i" } },
                { body: { $regex: this.queryStr.keyword, $options: "i" } }
                
            ]
        } : {};

      

        
          this.query = this.query.find({
            ...keyword,
          });

         
          
          return this;
        }

    filter (){
        const queryCopy ={...this.queryStr};

        //remove fields from the query
        const removeFields = ["keyword", "limit", "page"]
        removeFields.forEach(el=> delete queryCopy[el]);

        //advanced filter for price, kilometers and year
        let queryStr=JSON.stringify(queryCopy)
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match=> `$${match}`)
        

        this.query=this.query.find(JSON.parse(queryStr));
        return this

    }

    pagination(resPerPage){
        const currentPage =Number (this.queryStr.page) ||1;
        const skip = resPerPage *(currentPage-1)

        this.query=this.query.limit(resPerPage).skip(skip)
        return this
    }
}


    
module.exports = APIFeatures