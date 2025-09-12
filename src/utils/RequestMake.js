import axios from "axios";

let errorMessage = {
   success: 0,
   message: "Server Busy Please Try Again Later"
}
export default async (url, options) => {
   try {
      let response = null;
      if (options.method == "GET") {
         const result = await axios.get(url, options);
         response = result?.data;
      } else {
         const result = await axios.post(url, options.body, options);
         response = result?.data;
      }
      return response;

   } catch (error) {      
      return errorMessage
   }

}