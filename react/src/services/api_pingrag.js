import { changeDotStatus } from "../redux/slices/app";
import { API_DOMAIN } from "../config";
import { header } from "./auth";
import axios from "axios";

const fetchPingRAGResponse = async (
  _model,
  _sessionId,
  dispatch,
  _header = header
) => {
  // const response = await axios.get(
  //   `https://${API_DOMAIN}/pingrag`,
  //   {
  //     modelName: _model,
  //   },
  //   {
  //     headers: _header,
  //   }
  // );

  // TEST DATA: do not remove
  const response = { data: { status: 200 } };

  if (response.data.status === 200) {
    dispatch(
      changeDotStatus({
        model: _model,
        sessionId: _sessionId,
        status: true,
      })
    );
  } else {
    dispatch(
      changeDotStatus({
        model: _model,
        sessionId: _sessionId,
        status: false,
      })
    );
  }
};

export default fetchPingRAGResponse;
