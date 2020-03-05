//
//  CNContactViewController+CancelHack.h
//  RCTContacts
//
//  Created by Jun Wang on 2020/3/5.
//  Copyright © 2020 rt2zz. All rights reserved.
//

#import <ContactsUI/ContactsUI.h>

NS_ASSUME_NONNULL_BEGIN

@interface CNContactViewController (CancelHack)
- (void)cancelHack;
+ (void)swizzleEditCancelMethod;
+ (void)revertEditCancelMethod;

@end

NS_ASSUME_NONNULL_END
