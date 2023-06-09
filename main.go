package main

import (
	"fmt"
	"html/template"
	"io"
	"net/http"
	"os"
	"path"
	"time"
)

func handleUptime(w http.ResponseWriter, r *http.Request) {
	// You might want to move ParseGlob outside of handle so it doesn't
	// re-parse on every http request.
	tmpl, err := template.ParseGlob("templates/*")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	loc, err := time.LoadLocation("Asia/Ho_Chi_Minh")
	if err != nil {
		panic(err)
	}

	// Get the current time in that location
	now := time.Now().In(loc)

	// Print the time
	fmt.Println("The time in Vietnam is", now)
	name := ""
	if r.URL.Path == "/ut" {
		name = "index.html"
	} else {
		name = path.Base(r.URL.Path)
	}

	data := struct {
		Time time.Time
	}{
		Time: time.Now().In(loc),
	}

	if err := tmpl.ExecuteTemplate(w, name, data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println("error", err)
	}
}
func handleHome(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")

	// Open the HTML file
	file, err := os.Open("./Page/Home/Home.html")
	if err != nil {
		// Handle the error
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer file.Close()

	// Copy the file content to the writer
	io.Copy(w, file)

}
func main() {
	fmt.Println("Server setting up...")
	http.Handle(
		"/static/",
		http.StripPrefix(
			"/static/",
			http.FileServer(http.Dir("static")),
		),
	)
	fmt.Println("Static done")
	http.HandleFunc("/ut", handleUptime)
	fmt.Println("Uptime done")
	http.HandleFunc("/", handleHome)
	fmt.Println("Home done")
	fmt.Println("Setup done!")
	http.ListenAndServe(":8443", nil)
	fmt.Println("Setup done!")
}
