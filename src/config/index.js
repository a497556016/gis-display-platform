import production from "./env.pro";
import development from "./env.dev";

export default (() => {
    if(process.env.NODE_ENV === 'production') {
        return production;
    }else {
        return development;
    }
})();