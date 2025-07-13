import { editUserDetails, loginUser, registerUser, verifyJwtToken } from "../Controller/userController.js";


export default function UserRoutes(app){
    app.post("/login",loginUser);
    app.post("/register",registerUser);
    app.post("/editDetails",verifyJwtToken,editUserDetails);
}