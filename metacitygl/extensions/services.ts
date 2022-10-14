import { GLTFLoader } from "./gtlf/loader"
import { MetacityLoader } from "./metacity/loader/loader"



const services = {
    metacity: {
        loader: new MetacityLoader(),
    },
    gltf: {
        loader: new GLTFLoader(),
    }
}

export default services