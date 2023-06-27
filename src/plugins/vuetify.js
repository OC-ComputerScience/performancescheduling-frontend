import "@mdi/font/css/materialdesignicons.css";
import "../settings.scss";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { VDataTable } from "vuetify/labs/VDataTable";

export default createVuetify({
  components: {
    VDataTable,
  },
  theme: {
    defaultTheme: "lightTheme",
    themes: {
      lightTheme: {
        dark: false,
        colors: {
          maroon: "#77202B",
          lightMaroon: "#F2DFE1",
          teal: "#78C1B6",
          lightTeal: "#CEE4E1",
          blue: "#3272AA",
          lightBlue: "#D7E1E9",
          darkBlue: "#1A465F",
          lightDarkBlue: "#D5DCDF",
          orange: "#DF5B48",
          lightOrange: "#EEC8C2",
          yellow: "#F2C754",
          lightYellow: "#F4E9CC",
          mediumGray: "#C5C5C5",
          lightGray: "#F4F4F4",
        },
      },
    },
    icons: {
      defaultSet: "fa",
      aliases,
      sets: {
        fa,
      },
    },
  },
});
