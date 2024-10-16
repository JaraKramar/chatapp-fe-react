import { ChangeDotStatus } from '../redux/slices/app';
import { api_domain } from "../config";
import { header } from './auth'


const fetchPingRAGResponse = async (_model, _sessionId, dispatch, _header=header) => {

    // const response = await axios.get(`https://${api_domain}/pingrag`, 
    //   {
    //     model_name: _model,
    //   },
    //   {
    //     headers: _header
    //   });

    const response = {status: 200};

    if (response.status === 200) {
      dispatch(ChangeDotStatus({
        model: _model,
        sessionId: _sessionId,
        status: true
      }))
    } else {
      dispatch(ChangeDotStatus({
        model: _model,
        sessionId: _sessionId,
        status: false
      }))
    }
};

export default fetchPingRAGResponse;