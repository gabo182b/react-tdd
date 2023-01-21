import React, { useEffect, useState } from "react"

const foodList = ["Hamburger", "Pizza", "Arepas"]

const fakeApiCall = () => new Promise((resolve) =>
    setTimeout(resolve(foodList), 2000)
)

function AsyncList() {
    const [foodData, setFoodData] = useState([])

    useEffect(() => {
        fakeApiCall()
            .then((data) => setFoodData(data))
    }, [])

    return foodData.map((name) => <p key={name}>{name}</p>)
}

export default AsyncList
