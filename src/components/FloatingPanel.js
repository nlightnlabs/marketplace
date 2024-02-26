import React, {useRef, useState, useEffect} from "react"
import { toProperCase } from "../functions/formatValue";

const FloatingPanel = (props) => {
    const { children, title, height, width, appData, displayPanel } = props;
    const icons = appData.icons

    const panelRef = React.useRef();
    const allowDrag = true

    const [position, setPosition] = React.useState({ x: 0.5*window.innerWidth, y: 0.5*window.innerHeight });
    const [isDragging, setIsDragging] = React.useState(false);
    const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  
    const containerStyle = {
      position: "fixed",
      height: height,
      width: width,
      transform: "translate(-50%, -50%)",
      cursor: "move",
      zIndex: 9999,
    };
  
    const handleMouseDown = (e) => {
      if (!allowDrag) return;
      setIsDragging(true);
      setOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    };

    const handleMouseUp = (e) => {
        setIsDragging(false)
    };
  
    const handleMouseMove = (e) => {
      if (!isDragging || !allowDrag) return;
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      });
    };

    const iconButtonStyle = {
      height: "30px",
      width: "30px",
      cursor: "pointer"
    }
  
    return (
      <div
        ref={panelRef}
        className="d-flex flex-column bg-light shadow border border-3 rounded-3"
        style={{
          ...containerStyle,
          left: position.x + "px",
          top: position.y + "px"
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onDoubleClick={handleMouseUp}
      >
        <div className="d-flex justify-content-between align-items-center" style={{backgroundColor:"rgb(0,100,255)", height:"30px", overflow:"hidden"}}>
          <div className="d-flex ms-1" style={{fontSize:"18px", color: "white", fontWeight: "bold"}}>{toProperCase(title)}</div>
          <div className="d-flex" style={{fontSize:"16px"}} >
            <img src={icons.length>0 && icons.find(i=>i.name==="close").image} style={iconButtonStyle} onClick={(e)=>displayPanel(false)}/>
          </div>
        </div>
        <div className="d-flex flex-wrap" style={{height: "95%", width: "100%", overflowY:"auto", overflowX: "hidden"}}>
          {children}
        </div>
      </div>
    );
  };

  export default FloatingPanel