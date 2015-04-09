xquery version "1.0-ml";

module namespace dmlc = "http://marklogic.com/rest-api/resource/auto-suggest";
import module namespace json="http://marklogic.com/xdmp/json"
at "/MarkLogic/json/json.xqy";
declare namespace roxy = "http://marklogic.com/roxy";

(: 
 : To add parameters to the functions, specify them in the params annotations. 
 : Example
 :   declare %roxy:params("uri=xs:string", "priority=xs:int") dmlc:get(...)
 : This means that the get function will take two parameters, a string and an int.
 :)

(:
 :)
declare 
%roxy:params("qInput=xs:string")
function dmlc:get(
  $context as map:map,
  $params  as map:map
) as document-node()*
{
  let $query-input := (map:get($params, "qInput") || '*')

  let $type-ahead:=
    <tuples>{
      cts:value-tuples(
          (cts:field-reference("prod-name","collation=http://marklogic.com/collation/codepoint")
          ),(),(cts:field-value-query("prod-name", "iph*","wildcarded")))
    }</tuples>

  return document{$type-ahead},
  map:put($context, "output-types", "application/xml"),
  xdmp:set-response-code(200, "OK")

};

(:
 :)
declare 
%roxy:params("")
function dmlc:put(
    $context as map:map,
    $params  as map:map,
    $input   as document-node()*
) as document-node()?
{
  map:put($context, "output-types", "application/xml"),
  xdmp:set-response-code(200, "OK"),
  document { "PUT called on the ext service extension" }
};

(:
 :)
declare 
%roxy:params("")
function dmlc:post(
    $context as map:map,
    $params  as map:map,
    $input   as document-node()*
) as document-node()*
{
  map:put($context, "output-types", "application/xml"),
  xdmp:set-response-code(200, "OK"),
  document { "POST called on the ext service extension" }
};

(:
 :)
declare 
%roxy:params("")
function dmlc:delete(
    $context as map:map,
    $params  as map:map
) as document-node()?
{
  map:put($context, "output-types", "application/xml"),
  xdmp:set-response-code(200, "OK"),
  document { "DELETE called on the ext service extension" }
};
