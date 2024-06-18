import React from 'react'
import databaseServiceObj from '../appwrite/config'

const Postcard = ({ $id, Title,Image }) => {

    return (
            <div className="group relative ">
                <div className="mb-4 overflow-hidden">
                    <img
                        src={databaseServiceObj.previewFile(Image)}
                        alt={Title}
                        className="rounded-md m-auto transition duration-300 ease-in-out transform group-hover:scale-110"
                    />
                </div>
                <h2 className="text-lg font-bold">{Title}</h2>
            </div>
    )
}

export default Postcard