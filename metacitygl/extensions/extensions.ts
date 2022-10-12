import { GLTFLoader } from "./metacity/gltf/loader"
import { MetacityLoader } from "./metacity/loader/loader"



const extensions = {
    metacity: {
        loader: new MetacityLoader(),
    },
    gltf: {
        loader: new GLTFLoader(),
    }
}

export default extensions