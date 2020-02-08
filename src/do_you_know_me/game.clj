(ns do-you-know-me.game
  (:require [clojure.test :refer :all]
            [do-you-know-me.QUESTIONS :refer [questions]]
            [do-you-know-me.utils :refer [in?]]))

(def game-states (atom {}))

(def emojis ["🐹" "🐶" "🐱" "🦊" "🐻" "🐯" "🦁" "🐸" "🐵" "🐥"])
(def colors ["#f368e0" "#ff9f43" "#ee5253" "#ee5253" "#10ac84" "#5f27cd" "#795548" "#8BC34A"])


(defn create-game
  {:test (fn []
           (is (= (create-game "1234") (:1234 @game-states)))
           (is (= (->> (create-game "1234")
                       (:title))
                  "Do you know me? 🤔")))}
  [id]
  (swap! game-states assoc (keyword id) {:id                id
                                         :title             "Do you know me? 🤔"
                                         :gameStarted       false
                                         :players           {}
                                         :answeredQuestions []})
  ((keyword id) @game-states))


(defn get-game-state
  {:test (fn []
           (create-game "1234")
           (is (= (get-game-state "1234") (create-game "1234"))))}
  [id]
  ((keyword id) @game-states))


(defn get-player
  {:test (fn []
           (declare add-player)
           (is (= (:id (get-player (-> (create-game "1234")
                                       (add-player "p1"))
                                   "p1"))
                  "p1")))}
  [state id]
  (get-in state [:players (keyword id)]))


(defn get-players
  {:test (fn []
           (is (= (get-players (create-game "1234")) ()))
           (is (= (count (get-players (-> (create-game "1234")
                                          (add-player "p1")
                                          (add-player "p2"))))
                  2)))}
  [state]
  (map (fn [key]
         (get-player state key))
       (keys (:players state))))


(defn get-game-questions
  {:test (fn []
           (is (= (count (get-game-questions))
                  36)))}
  []
  (sort-by (juxt :points :id) (map (fn [key]
                                     (key questions))
                                   (keys questions))))


(defn get-coll-players-key
  {:test (fn []
           (is (= (count (-> (create-game "1234")
                             (add-player "p1")
                             (add-player "p2")
                             (get-coll-players-key :emoji)))
                  2)))}
  [state key]
  (map key (get-players state)))


(defn pick-unique-key
  {:test (fn []
           (let [state (create-game "1234")]
             (is (= (:color (pick-unique-key (add-player state "p1") colors :color))
                    (:color (get-player state "p1"))))
             (is (= (:emoji (pick-unique-key (add-player state "p1") emojis :emoji))
                    (:emoji (get-player state "p1"))))))}
  [state coll key]
  (rand-nth (filter
              (fn [item]
                (not (some #(= item %) (get-coll-players-key state key))))
              coll)))

;(defn update-player
;  [state, id]
;  (update-in state [:players (get-player state id)]))

(defn add-player
  {:test (fn []
           (is (= (get-in (add-player (create-game "1234") "p1") [:players :p1 :id]) "p1"))
           (is (= (keys (:players (-> (create-game "1234")
                                      (add-player "p1")
                                      (add-player "p2"))))
                  '(:p1 :p2))))}
  [state id]
  (assoc-in state
            [:players (keyword id)]
            {:username  "unknown"
             :id        id
             :emoji     (pick-unique-key state emojis :emoji)
             :color     (pick-unique-key state colors :color)
             :questions {}
             :points    0
             :ready     false}))


(defn set-username
  {:test (fn []
           (is (= (get-in (set-username
                            (-> (create-game "1234")
                                (add-player "p1"))
                            "p1"
                            "Kalle") [:players :p1 :username])
                  "Kalle")))}
  [state, id, username]
  (assoc-in state [:players (keyword id) :username] username))


(defn add-question-to-player
  {:test (fn []
           (is (= (:1 (get-in (add-question-to-player
                                (-> (create-game "1234")
                                    (add-player "p1"))
                                "p1"
                                1) [:players :p1 :questions]))
                  {:id       1,
                   :question "What is/was your mothers name?",
                   :tags     ["family" "parent"],
                   :points   100,
                   :level    "easy",
                   :focus    false,
                   :playerId "p1"})))}
  [state, id, questionId]
  (assoc-in state
            [:players (keyword id) :questions (keyword (str questionId))]
            (-> ((keyword (str questionId)) questions)
                (assoc :focus false)
                (assoc :playerId id))))


(defn set-player-ready
  {:test (fn []
           (is (= (get-in (set-player-ready
                            (-> (create-game "1234")
                                (add-player "p1"))
                            "p1"
                            true) [:players :p1 :ready])
                  true)))}
  [state, id, ready]
  (assoc-in state [:players (keyword id) :ready] ready))


(defn start-game
  {:test (fn []
           (is (= (:gameStarted (start-game (-> (create-game "1234")
                                                (add-player "p1")))) true))
           (is (not= (:turn (start-game (-> (create-game "1234")
                                            (add-player "p1")
                                            (add-player "p2")))) nil)))}
  [state]
  (as-> (assoc state :gameStarted true) $
        (assoc $ :turn (:id (rand-nth (get-players $))))
        (assoc $ :playOrder (into [] (keys (:players $))))))


(defn set-focus
  {:test (fn []
           (is (= (:focus (get-in (set-focus (-> (create-game "1234")
                                                 (add-player "p1")
                                                 (add-question-to-player "p1" 1))
                                             "p1"
                                             1
                                             true) [:players :p1 :questions :1]))
                  true))
           (is (= (get-in (set-focus (-> (create-game "1234")
                                         (add-player "p1")
                                         (add-question-to-player "p1" 1)
                                         (add-question-to-player "p1" 2)
                                         (set-focus "p1" 1 true))
                                     "p1"
                                     2
                                     true) [:players :p1 :questions :2 :focus])
                  true)))}
  [state playerId questionId bool]
  (update-in state [:players (keyword playerId) :questions]
             (fn [questions]
               (-> (into {} (for [[k v] questions]
                              [k (assoc v :focus false)]))
                   (assoc-in [(keyword (str questionId)) :focus] bool)))))

(defn set-active-question
  {:test (fn []
           (is (= (:activeQuestion (set-active-question (create-game "123") (:1 questions)))
                  (assoc (:1 questions) :answers {}))))}
  [state, question]
  (assoc state :activeQuestion (assoc question :answers {})))


(defn answer
  {:test (fn []
           (is (= (-> (answer (create-game "1234") "p1" "test answer")
                      (:activeQuestion)
                      (:answers)
                      (:p1)
                      (:answer))
                  "test answer")))}
  [state playerId answer]
  (update-in state [:activeQuestion :answers] assoc (keyword playerId) {:answer   answer
                                                                        :playerId playerId}))

(defn correct-answer
  {:test (fn []
           (is (= (-> (correct-answer (-> (create-game "1234")
                                          (set-active-question (:1 questions))
                                          (answer "p1" "test answer")) "p1" false)
                      (get-in [:activeQuestion :answers :p1 :correct]))
                  false)))}
  [state playerId correct]
  (assoc-in state [:activeQuestion :answers (keyword playerId) :correct] correct))


(defn give-score
  {:test (fn []
           (declare change-turn)
           (is (= (as-> (create-game "123") $
                        (add-player $ "p1")
                        (set-active-question $ (:1 questions))
                        (start-game $)
                        (answer $ "p1" "test answer")
                        (correct-answer $ "p1" true)
                        (give-score $)
                        (get-in $ [:players :p1 :points]))
                  100)))}
  [state]
  (first (map (fn [key]
                (if (get-in state [:activeQuestion :answers key :correct])
                  (update-in state [:players key :points] + (get-in state [:activeQuestion :points]))
                  state))
              (keys (get-in state [:activeQuestion :answers])))))

(defn set-player-question-answered
  {:test (fn []
           (is (= (as-> (create-game "123") $
                        (add-question-to-player $ "p1" 1)
                        (set-active-question $ (get-in $ [:players :p1 :questions :1]))
                        (set-player-question-answered $)))))}
  [state]
  (assoc-in state
            [:players
             (keyword (get-in state [:activeQuestion :playerId]))
             :questions
             (keyword (str (get-in state [:activeQuestion :id])))
             :answered]
            true))


(defn check-winner
  {:test (fn []
           (declare change-turn)
           (is (= (:points (first (:results (as-> (create-game "1234") $
                                                  (add-player $ "p1")
                                                  (add-player $ "p2")
                                                  (add-player $ "p3")
                                                  (add-question-to-player $ "p1" "1")
                                                  (set-active-question $ (get-in $ [:players :p1 :questions :1]))
                                                  (start-game $)
                                                  (answer $ "p2" "test answer")
                                                  (correct-answer $ "p2" true)
                                                  (change-turn $)
                                                  (answer $ "p3" "test answer")
                                                  (change-turn $)
                                                  (check-winner $))))) 100)))}
  [state]
  (if (= (count (:answeredQuestions state))
         (reduce + (map #(count (:questions %)) (get-players state))))
    (assoc state :results (reverse (sort-by :points (get-players state))))
    state))

(defn change-turn
  {:test (fn []
           (is (let [state (as-> (create-game "123") $
                                 (add-player $ "p1")
                                 (add-player $ "p2")
                                 (start-game $))]
                 (not= (:turn state) (change-turn state))))
           (is (= (-> (create-game "1234")
                      (add-player "p1")
                      (add-player "p2")
                      (start-game)
                      (set-active-question (:1 questions))
                      (answer "p1" "test answer")
                      (correct-answer "p1" true)
                      (change-turn)
                      (:activeQuestion))
                  nil)))}
  [state]
  (as-> (give-score state) $
        (set-player-question-answered $)
        (assoc $ :turn (nth (:playOrder state)
                            (mod (+ (.indexOf (:playOrder state) (keyword (:turn state))) 1)
                                 (count (:playOrder state)))))
        (update $ :answeredQuestions conj (:activeQuestion $))
        (set-focus $ (get-in $ [:activeQuestion :playerId]) (get-in $ [:activeQuestion :id]) false)
        (assoc $ :activeQuestion nil)
        (check-winner $)))

(defn maybe-change-turn
  {:test (fn []
           (is (let [state (as-> (create-game "1234") $
                                 (add-player $ "p1")
                                 (add-player $ "p2")
                                 (add-player $ "p3")
                                 (add-question-to-player $ "p1" "1")
                                 (set-active-question $ (get-in $ [:players :p1 :questions :1]))
                                 (start-game $)
                                 (answer $ "p2" "test answer")
                                 (answer $ "p3" "test answer"))]
                 (not= (maybe-change-turn state) state))))}
  [state]
  (if (= (keys (get-in state [:activeQuestion :answers]))
         (remove nil? (filter #(not= % (keyword (get-in state [:activeQuestion :playerId]))) (keys (:players state)))))
    (change-turn state)
    state))

(defn add-error
  {:test (fn []
           (is (not= (:error (add-error (create-game "123") "error message")) nil)))}
  [state error]
  (assoc state :error error))