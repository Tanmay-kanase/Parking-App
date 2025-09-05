import React, { useEffect } from "react";
import mermaid from "mermaid";

const SystemArchitecture = () => {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.contentLoaded();
  }, []);

  const diagram = `
  stateDiagram-v2
    [*] --> Available
    
    Available --> Searched: User searches parking
    Searched --> Selected: User selects slot & time
    Selected --> PaymentPending: Proceed to payment
    PaymentPending --> Booked: Payment successful
    PaymentPending --> Cancelled: User cancels before payment
    
    Booked --> Occupied: User checks in
    Occupied --> Released: User leaves / booking ends
    
    Booked --> Cancelled: User cancels before check-in
    Available --> Blocked: Admin disables slot
    Blocked --> Available: Admin re-enables slot

`;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6">
        System Architecture
      </h2>
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="mermaid">{diagram}</div>
      </div>
    </div>
  );
};

export default SystemArchitecture;
