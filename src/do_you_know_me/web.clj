(ns do-you-know-me.web
  (:require [org.httpkit.server :refer [run-server]]
            [do-you-know-me.handler :refer [handler]]
            [ring.middleware.defaults :refer [site-defaults wrap-defaults]]
            [compojure.route :as route]
            [clojure.java.io :as io]
            [compojure.core :refer [defroutes, GET]]
            [ring.util.response :refer (response redirect content-type)]
            ))


(defroutes app
           (GET "/" {c :context} (redirect (str c "/build/index.html")))
           (route/resources "/")
           (route/not-found "<h1>Page not found</h1>"))

(defn serve-react-app [request]
  {:status 200
   :headers {"Content-Type" "text/html"}
   :body (slurp (io/resource "public/build/index.html"))})

(defn -main
  "I don't do a whole lot ... yet."
  [& args]
  (println "Hello, World!")
  (run-server handler {:port      9090
                       :insecure? true
                       })
  (run-server serve-react-app {:port      8080 }))
