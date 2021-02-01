import React, { useEffect } from "react";
import "./style.scss";
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "../../store/actions/systemAction";
const Toggle = (props) => {
  const { currentTheme } = useSelector((state) => state.system);
  const dispatch = useDispatch();

  return (
    <label class="switch" {...props}>
      <input
        type="checkbox"
        checked={currentTheme === "light"}
        onClick={(e) =>
          dispatch(setTheme(currentTheme === "light" ? "dark" : "light"))
        }
      />
      <div>
        <span></span>
      </div>
    </label>
  );
};

export default Toggle;
