// Part 2 Step 2
const stringifyData = (obj) => {
    try {
        return JSON.stringify(obj);
    } catch (error) {
        console.error("Stringify failed:", error.message);
    }
};

// Part 2 Step 3
const parseData = (jsonStr) => {
    try {
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Parsing failed:", error.message);
        return null;
    }
};

// Part 3
const validateAnimalData = (data) => {
    const requiredFields = ['id', 'species', 'name', 'age'];
    
    if (!Array.isArray(data)) throw new Error("Invalid Format: Data must be an array.");

    data.forEach((animal, index) => {
        // Check for required fields
        requiredFields.forEach(field => {
            if (!(field in animal)) {
                throw new Error(`Missing Field: "${field}" at index ${index}`);
            }
        });

        // Validate Data Types
        if (typeof animal.id !== 'number') throw new Error(`Type Error: ID must be a number at index ${index}`);
        if (typeof animal.age !== 'number') throw new Error(`Type Error: Age must be a number at index ${index}`);
        if (typeof animal.name !== 'string') throw new Error(`Type Error: Name must be a string at index ${index}`);
    });

    return true;
};



const runTests = () => {
    console.group("JSON Processing Tests");

    // Test 1: Valid Data
    const validJSON = '[{"id": 4, "species": "Tiger", "name": "Khan", "age": 3}]';
    console.log("Test 1 (Valid):", validateAnimalData(JSON.parse(validJSON)));

    // Test 2: Missing Field
    try {
        const missingField = '[{"id": 5, "name": "NoSpecies", "age": 2}]';
        validateAnimalData(JSON.parse(missingField));
    } catch (e) {
        console.warn("Test 2 (Missing Field) Caught:", e.message);
    }

    // Part 2 Step 2
    const badJSON = '{ "id": 1, "name": "Broken" '; // Missing closing brace
    console.log("Test 3 (Bad Format):", parseData(badJSON)); 

    // Test 4: Incorrect Data Type
    try {
        const badType = '[{"id": "six", "species": "Wolf", "name": "Akela", "age": 4}]';
        validateAnimalData(JSON.parse(badType));
    } catch (e) {
        console.warn("Test 4 (Bad Type) Caught:", e.message);
    }

    // Part 2 Step 2
    console.log(stringifyData({ id: 1, name: "John", age: 30 }));

    console.groupEnd();
};

runTests();