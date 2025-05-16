<<<<<<< HEAD
const express = require("express");   //CREATING A BINDING THAT REUIRES "express"
const mongoose = require("mongoose")
const app = express();                 // CREATING THE BINDING "app" and asking it to run "express" as a function

const PORT = process.env.PORT || 7000;     // telling the cloud to use its port available at the process environment or use mine = 7000

app.use(express.json());                        // This returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option
//this is the middleware that parses what is coming from the frontend to allow the backend to understand it in the json format

const MONGODB_URL = "mongodb+srv://Charles:Charles@cluster0.xah33ss.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log("mongoDB connected")
        app.listen(PORT, () => {
            console.log(`server running at port ${PORT}`)    // to listen to any requests when my server is called. Then show the port it is listening to.
        })
    })
    .catch((error) => {
        console.error("Database not connected", error)
    })



app.get("/test-server", (request, response) => {

    response.json("welcome online, server started succesful")
})


app.post("/add-user", (request, response) => {
    const newUser = request.body
    response.json({
        message: "user saved successfully",
        newUser
    })
})
// an array of drug data set
const drugs = [

    { id: 1, name: "Amoxicillin", category: "Antibiotic", dosageMg: 500, isPrescriptionOnly: true, stock: 120, manufacturer: "Pfizer" },

    { id: 2, name: "Paracetamol", category: "Analgesic", dosageMg: 1000, isPrescriptionOnly: false, stock: 200, manufacturer: "GSK" },

    { id: 3, name: "Ibuprofen", category: "Analgesic", dosageMg: 400, isPrescriptionOnly: false, stock: 150, manufacturer: "Bayer" },

    { id: 4, name: "Chloroquine", category: "Antimalarial", dosageMg: 250, isPrescriptionOnly: true, stock: 80, manufacturer: "Sanofi" },

    { id: 5, name: "Ciprofloxacin", category: "Antibiotic", dosageMg: 500, isPrescriptionOnly: true, stock: 70, manufacturer: "Pfizer" },

    { id: 6, name: "Loratadine", category: "Antihistamine", dosageMg: 10, isPrescriptionOnly: false, stock: 160, manufacturer: "Novartis" },

    { id: 7, name: "Metformin", category: "Antidiabetic", dosageMg: 850, isPrescriptionOnly: true, stock: 140, manufacturer: "Teva" },

    { id: 8, name: "Artemether", category: "Antimalarial", dosageMg: 20, isPrescriptionOnly: true, stock: 60, manufacturer: "Roche" },

    { id: 9, name: "Aspirin", category: "Analgesic", dosageMg: 300, isPrescriptionOnly: false, stock: 180, manufacturer: "Bayer" },

    { id: 10, name: "Omeprazole", category: "Antacid", dosageMg: 20, isPrescriptionOnly: true, stock: 90, manufacturer: "AstraZeneca" },

    { id: 11, name: "Azithromycin", category: "Antibiotic", dosageMg: 250, isPrescriptionOnly: true, stock: 50, manufacturer: "Pfizer" },

    { id: 12, name: "Cetirizine", category: "Antihistamine", dosageMg: 10, isPrescriptionOnly: false, stock: 110, manufacturer: "Novartis" },

    { id: 13, name: "Insulin", category: "Antidiabetic", dosageMg: 100, isPrescriptionOnly: true, stock: 30, manufacturer: "Novo Nordisk" },

    { id: 14, name: "Artemisinin", category: "Antimalarial", dosageMg: 100, isPrescriptionOnly: true, stock: 50, manufacturer: "GSK" },

    { id: 15, name: "Codeine", category: "Analgesic", dosageMg: 30, isPrescriptionOnly: true, stock: 20, manufacturer: "Teva" },

    { id: 16, name: "Vitamin C", category: "Supplement", dosageMg: 500, isPrescriptionOnly: false, stock: 300, manufacturer: "Nature’s Bounty" },

    { id: 17, name: "Ranitidine", category: "Antacid", dosageMg: 150, isPrescriptionOnly: false, stock: 90, manufacturer: "Sanofi" },

    { id: 18, name: "Doxycycline", category: "Antibiotic", dosageMg: 100, isPrescriptionOnly: true, stock: 40, manufacturer: "Pfizer" },

    { id: 19, name: "Tramadol", category: "Analgesic", dosageMg: 50, isPrescriptionOnly: true, stock: 45, manufacturer: "Teva" },

    { id: 20, name: "Folic Acid", category: "Supplement", dosageMg: 5, isPrescriptionOnly: false, stock: 250, manufacturer: "Nature’s Bounty" }

];


// QUESTION 1. An API to get all drugs that are antibiotics.
// SOLUTION


app.get("/drugs/antibiotics", (req, res) => {
    const antibiotics = drugs.filter(drug => drug.category === "Antibiotic");
    res.json(antibiotics);
});



// QUESTION 2: An API to return an array of drug names in lowercase.
// SOLUTION

app.get("/drugs-names-lowercase", (req, res) => {
    const drugNamesLowercase = drugs.map(drug => drug.name.toLowerCase());
    res.json(drugNamesLowercase);
});



// QUESTION 3: an API TO Accept a category in the body and return all drugs under that category.
//Example body: { "category": "Antibiotic" }

// SOLUTION


app.post("/drugs-category", (req, res) => {
    const { category } = req.body;

    if (!category) {
        return res.status(400).json({ error: "Category is required in the request body." });
    }

    const matchedDrugs = drugs.filter(drug => drug.category.toLowerCase() === category.toLowerCase());
    res.json(matchedDrugs);
});






// QUESTION 4: An API to return an array of objects showing each drug’s name and manufacturer.

// SOLUTION
app.get("/drugs-summary", (req, res) => {
    const summary = drugs.map(drug => ({
        name: drug.name,
        manufacturer: drug.manufacturer
    }));
    res.json(summary);
});



// QUESTION 5: An API to return all drugs that require a prescription.
// SOLUTION


app.get("/drugs-prescription", (req, res) => {
    const prescribedDrugs = drugs.filter(drug => drug.isPrescriptionOnly === true);
    res.json(prescribedDrugs);
});



// QUESTION 6: An API to rturn a new array, each item should follow the format: "Drug: [name] - [dosageMg]mg".
// SOLUTION

app.get("/drugs-format", (req, res) => {
    const newDrugArray = drugs.map(drug => `Drug: ${drug.name} - ${drug.dosageMg}mg`);
    res.json(newDrugArray);
});



// QUESTION 7. An API to return all drugs where stock is less than 50.
// SOLUTION


app.get("/get-low-stock-Drugs", (req, res) => {
    const lowStockDrugs = drugs.filter(drug => drug.stock < 50);
    res.json(lowStockDrugs);
});




// QUESTION 8: An API to return all drugs that are not prescription-only.
// SOLUTION

app.get("/unprescribed-drugs", (req, res) => {
    const overTheCounterDrugs = drugs.filter(drug => drug.isPrescriptionOnly === false);
    res.json(overTheCounterDrugs);
});



// QUESTION 9. An API that accepts a manufacturer in the body and return how many drugs are produced by that manufacturer.
//Example body: { "manufacturer": "Pfizer" }
// SOLUTION

app.post("/manufacturer-drug-list", (req, res) => {
    const { manufacturer } = req.body;

    if (!manufacturer) {
        return res.status(400).json({ error: "Manufacturer is required in the request body." });
    }

    const count = drugs.filter(drug => drug.manufacturer.toLowerCase() === manufacturer.toLowerCase()).length;

    res.json({ manufacturer, count });
});





// QUESTION 10: An API that counts and returns how many drugs have the category "Analgesic"
// SOLUTION

app.get("/drugs-count-analgesic", (req, res) => {
    const count = drugs.filter(drug => drug.category.toLowerCase() === "analgesic").length;
    res.json({ category: "Analgesic", count });
});





// const express = require("express");   //CREATING A BINDING THAT REUIRES "express"

// const app = express();                 // CREATING THE BINDING "app" and asking it to run "express" as a function

// const PORT = process.env.PORT || 7000;     // telling the cloud to use its port available at the process environment or use mine = 7000

// app.use(express.json());                        // This returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option
// //this is the middleware that parses what is coming from the frontend to allow the backend to understand it in the json format


// // QUESTION 1. An API to get all drugs that are antibiotics.
// // SOLUTION


// app.get("/drugs/antibiotics", (req, res) => {
//     const antibiotics = drugs.filter(drug => drug.category === "Antibiotic");
//     res.json(antibiotics);
// });



// // QUESTION 2: An API to return an array of drug names in lowercase.
// // SOLUTION

// app.get("/drugs-names-lowercase", (req, res) => {
//     const drugNamesLowercase = drugs.map(drug => drug.name.toLowerCase());
//     res.json(drugNamesLowercase);
// });



// // QUESTION 3: an API TO Accept a category in the body and return all drugs under that category.
// //Example body: { "category": "Antibiotic" }

// // SOLUTION


// app.post("/drugs-category", (req, res) => {
//     const { category } = req.body;

//     if (!category) {
//         return res.status(400).json({ error: "Category is required in the request body." });
//     }

//     const matchedDrugs = drugs.filter(drug => drug.category.toLowerCase() === category.toLowerCase());
//     res.json(matchedDrugs);
// });






// // QUESTION 4: An API to return an array of objects showing each drug’s name and manufacturer.

// // SOLUTION
// app.get("/drugs-summary", (req, res) => {
//     const summary = drugs.map(drug => ({
//         name: drug.name,
//         manufacturer: drug.manufacturer
//     }));
//     res.json(summary);
// });



// // QUESTION 5: An API to return all drugs that require a prescription.
// // SOLUTION


// app.get("/drugs-prescription", (req, res) => {
//     const prescribedDrugs = drugs.filter(drug => drug.isPrescriptionOnly === true);
//     res.json(prescribedDrugs);
// });



// // QUESTION 6: An API to rturn a new array, each item should follow the format: "Drug: [name] - [dosageMg]mg".
// // SOLUTION

// app.get("/drugs-format", (req, res) => {
//     const newDrugArray = drugs.map(drug => `Drug: ${drug.name} - ${drug.dosageMg}mg`);
//     res.json(newDrugArray);
// });



// // QUESTION 7. An API to return all drugs where stock is less than 50.
// // SOLUTION


// app.get("/get-low-stock-Drugs", (req, res) => {
//     const lowStockDrugs = drugs.filter(drug => drug.stock < 50);
//     res.json(lowStockDrugs);
// });




// // QUESTION 8: An API to return all drugs that are not prescription-only.
// // SOLUTION

// app.get("/unprescribed-drugs", (req, res) => {
//     const overTheCounterDrugs = drugs.filter(drug => drug.isPrescriptionOnly === false);
//     res.json(overTheCounterDrugs);
// });



// // QUESTION 9. An API that accepts a manufacturer in the body and return how many drugs are produced by that manufacturer.
// //Example body: { "manufacturer": "Pfizer" }
// // SOLUTION

// app.post("/manufacturer-drug-list", (req, res) => {
//     const { manufacturer } = req.body;

//     if (!manufacturer) {
//         return res.status(400).json({ error: "Manufacturer is required in the request body." });
//     }

//     const count = drugs.filter(drug => drug.manufacturer.toLowerCase() === manufacturer.toLowerCase()).length;

//     res.json({ manufacturer, count });
// });





// // QUESTION 10: An API that counts and returns how many drugs have the category "Analgesic"
// // SOLUTION

// app.get("/drugs-count-analgesic", (req, res) => {
//     const count = drugs.filter(drug => drug.category.toLowerCase() === "analgesic").length;
//     res.json({ category: "Analgesic", count });
// });

// app.get("/test-server", (request, response) => {
//     const user = [
//         { firstName: "Tochukwu" },
//         { lastName: "ikechukwu" }
//     ]
//     response.send(user)
// })


// app.post("/add-user", (request, response) => {
//     const newUser = request.body
//     response.json({
//         message: "user saved successfully",
//         newUser
//     })
// })


// app.listen(PORT, () => {
//     console.log(`server running at port ${PORT}`)    // to listen to any requests when my server is called. Then show the port it is listening to.
// >>>>>>> 46ad5f8ba1b90d7ea4c884ecde0ff2b9d74de89a
// });