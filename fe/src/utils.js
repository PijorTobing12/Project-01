import * as XLSX from "xlsx";
import { date } from "quasar";
import dayjs from "dayjs";
import { io } from "socket.io-client";

export const nik = () => {
  let data = JSON.parse(window.localStorage.getItem("data"));
  return data.data.nik;
};

export const empid = () => {
  let data = JSON.parse(window.localStorage.getItem("data"));
  return data.data.empid;
};

export const nama = () => {
  let data = JSON.parse(window.localStorage.getItem("data"));
  return data.data.nama;
};

export const role = () => {
  let data = JSON.parse(window.localStorage.getItem("data"));
  return data.data.role;
};

export const domain = () => {
  return window.localStorage.getItem("domain");
};

export const domains = () => {
  let data = JSON.parse(window.localStorage.getItem("data"));
  return data.data.domains;
};

export const ParseError = (error) => {
  if (error.response.status == 406) {
    return error.response.data.message;
  } else if (error.response.status == 401) {
    window.localStorage.clear();
    setTimeout(() => {
      location.reload();
    }, 7000);
    return error.response.data.message;
  } else if (error.response.status == 500) {
    return "Telah terjadi kesalahan pada saat proses data, silahkan kontak team IT";
  } else {
    return error.message;
  }
};

export const excelDownload = (data, name) => {
  let wb1 = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wb1, name);
  return XLSX.writeFile(
    wb,
    `${name}-${date.formatDate(Date.now(), "YYYY-MM-DD-HH:mm:ss")}.xlsx`
  );
};

export const formatDateTime = (datetime) => {
  return dayjs(datetime).format("DD-MMM-YYYY HH:mm:ss");
};

export const formatDate = (datetime) => {
  return dayjs(datetime).format("DD-MMM-YYYY");
};

export const formatDateStandar = (datetime) => {
  return dayjs(datetime).format("YYYY-MM-DD");
};

export const dateTime = () => {
  return dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
};

export const dateOnly = () => {
  return dayjs(new Date()).format("YYYY-MM-DD");
};

export const dateOnlyDMY = () => {
  return dayjs(new Date()).format("DD-MM-YYYY");
};

export const dateOnlyMDY = () => {
  return dayjs(new Date()).format("DD-MM-YYYY");
};

export const daydateOnly = () => {
  return dayjs(new Date()).format("dddd, YYYY-MM-DD");
};

export const hasDuplicate = async(array) => {
  return new Set(array).size !== array.length;
};

export const npwp = () => {
  return window.localStorage.getItem("nik");
};

export const suppCode = () => {
  return window.localStorage.getItem("supp_code");
};

export const formatDateOnly = (value) => {
  if (value) { 
    return dayjs(value).format("DD-MMM-YYYY");
  } else {
    return '';
  }
};

export const formatHourMinuteOnly = (value) => {
  if (value) { 
    value = value.replaceAll('T', ' ').replaceAll('Z', '');
    return dayjs(value).format("HH:mm");
  } else {
    return '';
  }
};

export const formatRupiah = (value) => {
  if (value) {
    return new Intl.NumberFormat("de-ID").format(parseFloat(value));
  } else {
    return 0;
  }
};

export const formatRupiahWithFixed = (value) => {
  if (value) {
      let fixedValue = parseFloat(value).toFixed(0);
      if (fixedValue == -0) fixedValue = 0;
      return new Intl.NumberFormat("de-ID").format(fixedValue);
  } else {
      return 0;
  }
}

export const formatRupiahFixed2 = (value) => {
  if (value) {
      let fixedValue = '';
      if (isNaN(value)) {
          fixedValue = '';
      }
      else{
          fixedValue = parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      return fixedValue;       
  } else {
      return 0;
  }
}

export const formatNumberFixed = (value) => {
  if(value){  
      let roundValue = '';
      if (isNaN(value)) {
          roundValue = '';
      }
      else{
          roundValue = parseFloat(Math.round(value * 100) / 100);
      }
      return roundValue;     
  }
   else {
      return 0;
  }
}

export const formatNumberRound2 = (value) => {
  if(value){  
      let roundValue = '';
      if (isNaN(value)) {
          roundValue = '';
      }
      else{
          roundValue = parseFloat(Math.round(value * 100) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
      }
      return roundValue;     
  }
   else {
      return 0;
  }
}

export const NumberOnly = (evt) => {
  evt = (evt) ? evt : window.event;
  var charCode = (evt.which) ? evt.which : evt.keyCode;

  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      evt.preventDefault();
  } else {
      return true;
  }
}

export const NumberDotOnly = (evt) => {
  evt = (evt) ? evt : window.event;
  var charCode = (evt.which) ? evt.which : evt.keyCode;

  if ((charCode > 31 && (charCode < 48 || charCode > 57)) && (charCode !== 46 || evt.target.value.indexOf('.') != -1)) {
      evt.preventDefault();
  } else {
      return true;
  }
}

export const cekValPersen = () => {
  var value = /^\d+(\.\d{1,2})?$/;
  return value;
}

export const selisihBulan = (date1, date2) => {
  if(date1 && date2){
      if(date2 < date1){
          return 0;
      }
      else{
          var startDate = new Date(date1);
          var endDate = new Date(date2);
          var selisih = endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear())+1;
          return selisih;
      }
  }
  else{
      return 0;
  }
}
