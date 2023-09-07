s <- readr::read_tsv("./schedule.tsv")
s[1,2] <- s[5,2]

s[7,2] <- s[11,2]

s[13,2] <- s[14,2]

s[16,2] <- s[17,2]

s |> dplyr::rename(type_of = type) -> s

s |> jsonlite::toJSON() |>
  readr::write_lines("./schedule.json")
