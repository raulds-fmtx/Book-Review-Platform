function Popup({ children }) {
    return (
      <div
        style={{ height: 560, clear: "both", paddingTop: 120, textAlign: "center" }}
      >
        {children}
      </div>
    );
  }
  
  export default Popup;
  