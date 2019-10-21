document.title = 'Acme API Processor';
let companies = 'https://acme-users-api-rev.herokuapp.com/api/companies';
let products = 'https://acme-users-api-rev.herokuapp.com/api/products';
let offerings = 'https://acme-users-api-rev.herokuapp.com/api/offerings';

const grabCompanies = () => new Promise((resolve, reject) => {
    return window.fetch(companies)
    .then((response => response.json()))
    .then(jsonData => resolve(jsonData))
    .catch(e => reject(e))
});
const grabProducts = () => new Promise((resolve, reject) => {
    return window.fetch(products)
    .then((response => response.json()))
    .then(jsonData => resolve(jsonData))
    .catch(e => reject(e))
});
const grabOfferings = () => new Promise((resolve, reject) => {
    return window.fetch(offerings)
    .then((response => response.json()))
    .then(jsonData => resolve(jsonData))
    .catch(e => reject(e))
});

Promise.all([grabCompanies(), grabProducts(), grabOfferings()]).then((val)=>{
       let [companies, products, offerings ] = val.map( el => el)
       const productsPriceRange = findProductsInPriceRange(products, {min: 1, max : 15});
       console.log(productsPriceRange);
       const groupedCompaniesByLetter = groupCompaniesByLetter(companies);
       console.log(groupedCompaniesByLetter);
       const groupedCompaniesByState = groupCompaniesByState(companies);
       console.log(groupedCompaniesByState);
       const processedOfferings = processOfferings({companies, products, offerings});
       console.log(processedOfferings)
       const threeOrMoreOfferings = companiesByNumberOfOfferings(companies, offerings, 3);
       console.log(threeOrMoreOfferings);
       const processedProducts = processProducts({products, offerings});
       console.log(processedProducts)
    });

function processProducts(objData){
    return objData.products.reduce((acc, product) => {
        let count = 0
        let sum = 0
        objData.offerings.forEach(offering => {
          if(product.id === offering.productId){
          sum += offering.price
          count ++
          }
          })
         acc[product.name] = sum/count
         return acc
      }, {})
}

function companiesByNumberOfOfferings(c, o, num){
    return c.reduce((acc,company) => {
        let oNum =o.filter(offering => offering.companyId === company.id);
          if(oNum.length >= num){
             acc.push(company.name)
          }
          return acc
      }, [])
}

function processOfferings(objData){
    console.log(objData);
    return objData.offerings.map((offering) => {
        let obj = {}
        objData.companies.forEach(company => {
          if(company.id == offering.companyId){
            obj.id = offering.id
            obj.price = offering.price
            obj.company = company.name
          }
        })
          return obj
      })
}

function groupCompaniesByState(companiesData){
    let obj = {};
    companiesData.forEach(el => {
        let state = el.state;
        let name = el.name;
        obj[state] = name;
    });
    return obj
}

function groupCompaniesByLetter(companiesData) {
    return companiesData.map(el => el.name)
    .reduce((obj, el)=> {
        let firstLetter = el[0];
        obj[firstLetter] = el;
        return obj
    },{})
}

 function findProductsInPriceRange (productsData, obj) {
     let {min, max} = obj
    // console.dir(productsData)
    const prices = productsData.map( el => el.suggestedPrice)
    return prices.filter(price => {
        if(price <= max && price >= min) {
                return price
        }
    }).sort(function(a,b){
        return a - b
    });
 }
