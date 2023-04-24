class APIFilters {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    // search products
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        }: {}

        this.query = this.query.find({ ...keyword })
        return this
    }

    // to filter products by price and category
    filter() {
        const queryCopy = { ...this.queryStr }

        const removeFields = ['keyword', 'page']
        removeFields.forEach((el) => delete queryCopy[el])

        let output = {}
        let prop = ''

        for(let key in queryCopy) {
            if(!key.match(/\b(gt|gte|lt|lte)/)) {
                output[key] = queryCopy[key];
                
            } else {
                prop = key.split('[')[0]
                console.log('prop', prop)

                let operator = key.match(/\[(.*)\]/)[1]
                // console.log('operator', operator);

                if(!output[prop]) {
                    output[prop] = {}
                }

                output[prop][`$${operator}`] = queryCopy[key];
            }
        }

        console.log('output', );
        // { price: { $gte: 100, $lte: 1000 } }
        
        // output result
        this.query = this.query.find(output)
        return this;
    }

    // product pagination
    pagination(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1
        const skip = resPerPage * (currentPage - 1)

        this.query = this.query.limit(resPerPage).skip(skip)
        return this;
    }
}

export default APIFilters