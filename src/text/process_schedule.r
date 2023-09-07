
url <- "https://docs.google.com/spreadsheets/d/e/2PACX-1vSGQerGa8JQxAj-a-I1vJz-SMLAmpsfqwp36My4vMqVxVzhpLP2t7pPyA1SMUQXB7Ebh7i7guxYCF_0/pub?output=tsv"
s <- readr::read_tsv(url)

finish <- c(s[["type"]] |> grepl(pattern = "break") |> which() |> (\(x) x - 1)(), nrow(s))
start <- s[["type"]] |> grepl(pattern = "section") |> which()

markers <- tibble::tibble(
  sta = start,
  fin = finish
)

purrr::pwalk(markers, function(sta, fin) {
  s[sta, 2] <<- s[fin, 2]
})

s <- s |> dplyr::rename(type_of = type)

s |> jsonlite::toJSON() |>
  readr::write_lines("./schedule.json")
