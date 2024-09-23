--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13 (Debian 14.13-1.pgdg120+1)
-- Dumped by pg_dump version 14.13 (Debian 14.13-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: product; Type: TABLE; Schema: public; Owner: kirilllesniak
--

CREATE TABLE public.product (
    id bigint NOT NULL,
    article character varying(255),
    category character varying(255),
    in_stock integer,
    name character varying(255),
    price integer NOT NULL
);


ALTER TABLE public.product OWNER TO kirilllesniak;

--
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: kirilllesniak
--

CREATE SEQUENCE public.product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_id_seq OWNER TO kirilllesniak;

--
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kirilllesniak
--

ALTER SEQUENCE public.product_id_seq OWNED BY public.product.id;


--
-- Name: product id; Type: DEFAULT; Schema: public; Owner: kirilllesniak
--

ALTER TABLE ONLY public.product ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq'::regclass);


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: kirilllesniak
--

COPY public.product (id, article, category, in_stock, name, price) FROM stdin;
1	1	caterpillar	2	1	242
2	4231245	detroitdiesel	3	2	20000
3	924991235	volvopenta	23	форсунки	30000
4	32999	cummins	2	Клапана	60000
5	924991235	perkins	4	ТНВД	15000
6	2004202	maxiforce	12	дизель	20000
\.


--
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kirilllesniak
--

SELECT pg_catalog.setval('public.product_id_seq', 6, true);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: kirilllesniak
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

