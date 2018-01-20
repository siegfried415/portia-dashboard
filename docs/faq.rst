.. _faq:

FAQ
===

Does Portia support AJAX based websites?
----------------------------------------

Yes.

Does Portia work with large JavaScript frameworks like Ember?
-------------------------------------------------------------

Backbone, Angular, and Ember have all been thoroughly tested using Portia, and in most cases should work fine. React based websites aren't supported yet but we're working on it.

Does Portia support sites that require you to log in?
-----------------------------------------------------

Yes, you can set credentials in your spider's crawling configuration. In fact, Portia use loginform module to detect which form are for user name, and which are for password, but it is very possible for loginform to guess a wrong position which can make login fail. 

In this case, you can create a Action, so long as login page has not been modifed, Action will be performed correctly.  

Does Portia support content behind search forms?
------------------------------------------------

Yes, you can achieved this by creating an Action. 
