alert("Something went wrong");
window.confirm("Delete this item?");
toast("Saved");
toast.success("Profile updated");
toast.error(`Failed to load ${name}`);
toast("Saved", { id: "save" }); prompt("Your name?");

alert(t("error.generic"));
toast.success(t("profile.updated"));
toast(`${count}`);
toast(message);
console.log("Debug output");
setError("email", { type: "manual" });
throw new Error("Unexpected state");
toaster("Not a toast");
