import React, { useState } from 'react'

function Counter() {
    const [count, setcount] = useState(0)

    return (
        <>
            <button
                onClick={() => setcount(count + 1)}
            >
                Click
            </button>
            <p>
                Clicked times: {count}
            </p>
        </>
    )
}

export default Counter