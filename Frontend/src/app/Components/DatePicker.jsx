import DatePicker  from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function Date_Picker(props) {
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  return (
    <div className="border-2 border-black w-full ">
      <DatePicker
        selected={props.isCheckIn?props.checkIn:props.checkOut}
        onChange={(date) =>props.func(date)}
        selectsStart
        startDate={props.checkIn}
        endDate={props.checkOut}
        minDate={minDate}
        maxDate={maxDate}
        placeholderText={props.isCheckIn?"Check-in ":"Check-out"}
        className="w-full  bg-white p-2 focus:outline-none placeholder:text-black"
        wrapperClassName="min-w-full"
      />
    </div>
  )
}