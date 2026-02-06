const adminController = {
    index: (req, res) => {
        return res.render("index", { title: "Admin Page" });
    }
}

export default adminController;