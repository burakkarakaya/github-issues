import Url from './urls';
import {useFetch} from '@/hooks/useFetch';

const Issues = () => {
    return useFetch(Url.Issues);
};

export default Issues;