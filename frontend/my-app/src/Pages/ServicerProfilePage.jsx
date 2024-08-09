import React from "react";
import ServicerProfileComponent from "../components/ServicerProfileComponent";

function ServicerProfilePage() {
    return (
      <>  
        <div class="flex flex-wrap bg-gray-100 w-full h-screen">
        
        <div className="w-9/12">
              <div className="p-4 text-gray-500">
                <ServicerProfileComponent/>
               
              </div>
              </div>
        </div>
      </>
    )
  }
  
  export default ServicerProfilePage